---
schema: blog-post
lang: en
title: I Read About a $10 OpenStick Homelab, Then Added Three Monitoring Tools to My Mac mini
date: 2026-11-08
summary: "After reading about a $10 homelab, I asked two AI advisors whether my Mac mini setup needed replacing. They agreed: keep it, and add image alerts, resource graphs, and endpoint checks"
topics:
  - homelab
  - docker
  - monitoring
  - mac-mini
origin: original
translation: machine-assisted
---

## The starting point: an article about a $10 piece of homelab hardware

A few days ago, I read Laurens Bosscher's [What I run on my $10 USD OpenStick homelab](https://blog.bosscher.ch/posts/openstick/)

The author bought a USB-stick-sized device for just $10 (an OpenStick with four A53 cores and 512MB RAM), installed Debian and Podman, and ran ten services on it: AdGuard Home, Cloudflare Tunnel, Beszel, Gatus, Diun, Shiori, Fusion RSS, CastSponsorSkip, Dozzle, and even Zeroclaw for use by AI agents. Each service used somewhere around 5MB to 64MB of memory

My first reaction was admiration, followed by the inevitable look at my own machine at home

I use an M4 Mac mini (16GB RAM) as a home server. Docker runs in an OrbStack virtual machine with a 7.8GiB memory limit, hosting eleven containers for things like a work board, note syncing, a search crawler, a password vault, and a few MCP services of my own

I have far more resources than that 512MB stick, of course, but there was one very practical gap: **I had no real-time visibility into what was happening on the machine**

I had no resource usage graphs, no image update notifications, and no status dashboard. The services were generally stable, but I had no way to proactively see whether new images were available, how much memory was in use, or whether an API was actually responding. I could only open a terminal and check manually

Seeing someone else's setup so neatly put together made me wonder: should I tear down my existing architecture and replace it with the lightweight tools recommended in that article?

## Reviewing the setup: why both advisors said not to replace anything

Before changing anything, I gave two different AI advisors (Astra and Opus) the list of containers I currently run and the setup from that article. I asked each independently to assess which services were worth replacing and what gaps were worth filling

Their reports came back with almost exactly the same conclusions:

1. **None of my current services needed replacing**: The services I run, such as the Planka board and the three-part Obsidian sync setup, each have their own data structures and established workflows. Shiori (bookmark saving), Fusion RSS (a feed reader), and AdGuard Home from the article do not address any urgent problem in my daily use. Replacing things just to replace them would only create data migration work
2. **The only overlapping function was already unused**: The article uses Cloudflare Tunnel for exposing internal services. I used to have a `caddy-internal` reverse proxy for automation tools, but that workflow had been inactive for two months. There was no need to touch it
3. **Don't copy a high-risk configuration**: The article's author uses Zeroclaw as an AI agent harness on Telegram and even gives it a root shell inside the container. Their reasoning is that a dedicated $10 device has a limited blast radius. Copying that setup onto my Mac mini, which holds various services and data, would be much riskier. Besides, I already have a coding-agent workflow built around [[omp-orca-mac-mini-notes|Oh My Pi with Orca]], so there's no need to take on the security risk just to add another Telegram entry point
4. **Memory on Debian and macOS is not the same thing**: The author's impressively low memory numbers came from bare-metal Linux. On macOS with OrbStack, every Linux container runs inside a virtual machine, so the measurement baseline and underlying overhead are different

Both advisors gave me the same priority order: **leave the existing services alone and add only three lightweight operations tools that were missing**

- **Diun**: Periodically checks Docker Hub / Registry for new images and sends notifications. Absolutely no automatic updates (something like Watchtower restarting things in the middle of the night is more likely to cause trouble)
- **Beszel**: Lightweight resource monitoring for CPU, memory, and disk usage graphs
- **Gatus**: Periodically sends HTTP requests to services to check whether the application actually works, rather than just whether the container process is still running

## Putting it into service: a monitoring setup with a combined 320MB memory limit

Once I had decided what to do, I created a separate `~/monitoring/` directory on the Mac mini and put the three tools in their own Compose project, without disturbing any existing service containers

The four containers have deliberately modest memory limits:

| Service | Image and version | Memory limit | Purpose |
| --- | --- | --- | --- |
| Diun | `crazymax/diun:4.33.1` | 64MB | Daily image update scan; Telegram notifications only |
| Beszel hub | `henrygd/beszel:0.21.1` | 128MB | Monitoring dashboard (Web 8090 port); stores historical metrics |
| Beszel agent | `henrygd/beszel-agent:0.21.1` | 64MB | Read-only mount of docker.sock; collects container and system load |
| Gatus | `twinproduction/gatus:v5.38.0` | 64MB | Status dashboard (Web 8088 port); periodically checks endpoint responses |

The four memory limits add up to 320MB. In practice, all four containers used about 57MB combined (an idle-time snapshot from `docker stats`)

A few configuration details are worth noting:

- **Internal access and authentication**: Gatus's web interface does not require login. Any device on the same network can open `http://<Mac LAN IP>:8088` and see the health dashboard, so it is only suitable for internal status display and should not be exposed directly to the public internet. Beszel asks you to set an administrator username and password on first launch
- **Beszel monitors the virtual machine**: The Beszel agent mounts OrbStack's docker.sock read-only, so the CPU, memory, and disk graphs in the dashboard describe the Linux virtual machine allocated to OrbStack, not the macOS host itself
- **Beszel network connection**: Since the hub and agent are on the same Docker network, when adding a system in the dashboard I must enter the container name `beszel-agent` as the hostname (port 45876). Using the host IP does not work because Docker's internal network routing cannot reach it
- **Notification channel**: All notifications go through Telegram. I put the Bot Token and Chat ID in a `.env` file with permissions set to `600`, outside version control

<p class="code-caption">gatus-config.yaml</p>

```yaml
endpoints:
  - name: Planka board
    url: "http://<Mac LAN IP>:3201/api/config"
    interval: 1m
    conditions:
      - "[STATUS] == any(200, 401)"
    alerts:
      - type: telegram
```

There is one detail about health checks worth mentioning: I originally configured Gatus to call Planka's `/api/health`, but that endpoint only returns the frontend's static HTML page, which does not really tell me whether the backend API server is alive. I switched it to `/api/config`, which requires backend authentication, and set the status condition to `[STATUS] == any(200, 401)`. If the backend returns 401 Unauthorized, that is enough to show the backend is responding (this does not separately verify the database connection)

I should be clear that Gatus 5.38.0 does not provide a built-in command to manually trigger a test alert. I used the Telegram Bot API to send a message directly, along with Diun's built-in `notif test`, to check that the notification channel and credentials work. I'll only be able to verify that Gatus actually delivers a failure alert when a service really fails in the future

## Some practical snags the tutorials don't mention

I ran into a few interesting problems while wiring up the monitoring and notifications

### 1. The Telegram Chat ID is not the Bot's own ID

When configuring Telegram alerts for Diun and Gatus, I instinctively used the Bot's numeric ID as the destination. The API kept returning `403 Forbidden: bot can't send messages to the bot`

Then I remembered how Telegram works: a Bot cannot message itself. It needs the recipient's User ID. I had to look up my personal account ID with `@userinfobot` in Telegram, and, most importantly, **I first had to message the Bot in Telegram and press `/start`**. Only after the Bot was allowed to contact me could it deliver alerts

### 2. Never run docker image prune -a on a machine with local images you need

After setting up monitoring, I checked the disk and thought I'd clear out old images I no longer needed, so I ran `docker image prune -a`

The command finished and the running containers kept going, but when I checked afterward I found that two existing Obsidian-related images had been built locally and had tags that looked like `sha256-...`. Prune had untagged them as unused images. If Compose ever had to rebuild or restart them, it would fail because the images were missing

Luckily, the underlying layers were still there, and the cleanup helper reported the original image IDs. I quickly restored the tags with `docker tag <image id> <original tag name>`. The lesson: if you run containers built locally, don't casually run `prune -a`

### 3. Cleaning Docker images did not free space on my Mac

After deleting images and build cache, Docker reported about 4.2GB less in images and 1.7GB less in build cache (some layers are shared, so those numbers cannot simply be added). Excited, I ran `df -h` in the macOS terminal. Free space had only changed from 38G to 37G, and had actually gone down a little

That's because OrbStack's virtual disk is a sparse image. Deleting files inside Docker does not immediately return the space in the underlying virtual disk file to the macOS host

What actually got me disk space back was clearing local caches on the Mac:

- Delete `~/.bun/install/cache` (freed 4.4GB)
- Delete `~/Library/Caches/go-build` (freed 462MB)

Only after clearing those two caches did the Mac's available space go from 42.1G to 45.8G

### 4. The macOS Full Disk Access trap

When scanning and maintaining the disk, the terminal or helper tool running the commands needs Full Disk Access

After granting it in System Settings, the new disk permissions do not take effect immediately unless I completely quit and reopen the running app with `Cmd + Q`. That held me up for a few minutes

## In closing: the satisfaction of not replacing things just to replace them

Reading about someone else's neat, minimal architecture can easily make me want to tear everything down and start over. It can feel as if my own system is not elegant enough or uses too much memory

But if I take a moment to do the math, my existing containers are stable, and their data structures have already settled into my daily habits. Replacing them all just to save a few hundred MB would satisfy my technical perfectionism, but would do nothing for my actual life

Instead, the OpenStick article reminded me of a real blind spot: **"Running" does not mean "being in control"**

For a combined memory limit of 320MB, Diun, Beszel, and Gatus give me image update notifications, resource graphs, and an endpoint health dashboard, filling in the visibility I was missing

I'll leave it at that for now. At least when I'm away from home, Telegram will let me know if a service goes down or a new image is available, so I don't have to guess whether things at home are still running (the dashboards themselves are still only available on the local network)

## References

- [What I run on my $10 USD OpenStick homelab (Laurens Bosscher)](https://blog.bosscher.ch/posts/openstick/)
- [Diun official documentation](https://crazymax.dev/diun/)
- [Beszel GitHub repository](https://github.com/henrygd/beszel)
- [Gatus official documentation](https://gatus.io/)
