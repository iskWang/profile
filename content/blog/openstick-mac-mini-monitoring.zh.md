---
schema: blog-post
lang: zh
title: 看完 10 美元 OpenStick 的 Homelab，我最後只給 Mac mini 補了三樣監控
date: 2026-11-08
summary: 看到別人用 10 美元硬體把 homelab 跑得風生水起，原本好奇自己跑在 Mac mini 上的服務是不是該大換血，找了兩個 AI 獨立評估後，結論卻出奇一致：現有服務完全不用換，真正缺的反而是映像更新通知、資源曲線與端點存活檢查
topics:
  - homelab
  - docker
  - monitoring
  - mac-mini
origin: original
---

## 起點：一篇 10 美元硬體的 Homelab 文章

前幾天讀到 Laurens Bosscher 寫的 [What I run on my $10 USD OpenStick homelab](https://blog.bosscher.ch/posts/openstick/)

作者買了一支只要 10 美元的隨身碟型硬體（OpenStick，4 核 A53、512MB RAM），在上面灌了 Debian 和 Podman，一口氣跑了十個服務：AdGuard Home、Cloudflare Tunnel、Beszel、Gatus、Diun、Shiori、Fusion RSS、CastSponsorSkip、Dozzle，甚至還包含一個給 AI agent 用的 Zeroclaw，各個服務的記憶體佔用幾乎都在 5MB 到 64MB 之間

看完的第一反應除了佩服，難免會回頭看一下自己家裡的機器

我平常放在家裡當伺服器的是一台 Mac mini M4（16GB RAM），Docker 跑在 OrbStack 虛擬機裡，記憶體上限給到 7.8GiB，上面跑了十一個容器，包含工作看板、筆記同步、搜尋爬蟲、密碼庫和一些專屬的 MCP 服務

資源當然比 512MB 的隨身碟充裕得多，但有一個很實際的缺口：**這台機器一直缺乏即時的可見度**

沒有資源負載曲線、沒有映像更新通知，也沒有任何狀態看板，平時服務運作雖然穩定，但到底有沒有新映像釋出、記憶體吃了多少、API 是否真能正常回應，除了連進終端機敲指令查看之外，我其實沒有主動掌握的手段

看到別人的配置這麼精巧，我原本閃過一個念頭：是不是該把現有的架構推翻，換上那篇文章裡推薦的一整套輕量工具

## 盤點與評估：為什麼兩個顧問都說不要換

在動手之前，我先把自己的現役容器清單和那篇文章的配置餵給兩個不同的 AI 顧問（Astra 與 Opus），讓它們各自獨立評估：有哪些服務值得替換、有哪些缺口值得補

結果兩邊各自交出來的報告，結論幾乎完全重疊：

1. **現役服務一個都不需要換**：我目前跑的服務（像是 Planka 看板、Obsidian 同步三件套等）背後都有各自的資料結構與既定工作流，文章裡提到的 Shiori（書籤保存）、Fusion RSS（訂閱器）或 AdGuard Home，在我的日常情境裡根本沒有急迫痛點，為換而換只會製造資料遷移成本
2. **唯一功能重疊的早就沒在用**：文章用 Cloudflare Tunnel 做內網穿透，我原本有一組給自動化工具用的 `caddy-internal` 反向代理，但那套流程停用兩個月了，根本不需要特地去碰它
3. **不要照抄高風險的設定**：文章作者用 Zeroclaw 作為 Telegram 上的 AI agent harness，甚至給了容器 root shell，作者的考量是那支 10 美元的專用硬體影響範圍有限；但如果在我這台放了各種服務與資料的 Mac mini 上照抄同樣做法，風險就大得多，更何況我已經有一套以 [[omp-orca-mac-mini-notes|Oh My Pi 搭配 Orca]] 為核心的 coding agent 工作流，沒必要為了多一個 Telegram 入口承擔資安風險
4. **Debian 與 macOS 的記憶體不是同一件事**：文章作者測出的極低記憶體數字，是跑在純 Linux 裸機環境；但放到 macOS 搭配 OrbStack，任何 Linux 容器都跑在虛擬機內，量測基準與底層開銷本來就不一樣

最後兩位顧問給出的優先順序完全相同：**不要動現有服務，只補三個原本缺席的輕量維運工具**

- **Diun**：只負責定時檢查 Docker Hub / Registry 有沒有新版映像，並發送通知，絕對不要開自動更新（watchtower 那種半夜自動重啟反而容易踩雷）
- **Beszel**：極輕量的資源監控，看 CPU、記憶體與磁碟使用曲線
- **Gatus**：定期對服務發送 HTTP 請求，驗證業務邏輯是否真正活著，而不只是看容器 process 還在不在

## 實際上線：記憶體上限合計 320MB 的監控組合

決定好方向後，我在 Mac mini 開了一個獨立的目錄 `~/monitoring/`，把這三個工具寫成一組獨立的 Compose 專案，完全不干擾既有的業務容器

四個容器加起來，記憶體限制給得非常克制：

| 服務 | 映像檔與版本 | 記憶體上限 | 用途 |
| --- | --- | --- | --- |
| Diun | `crazymax/diun:4.33.1` | 64MB | 每日排程掃描映像更新，只送 Telegram 通知 |
| Beszel hub | `henrygd/beszel:0.21.1` | 128MB | 監控面板（Web 8090 port），儲存歷史指標 |
| Beszel agent | `henrygd/beszel-agent:0.21.1` | 64MB | 唯讀掛載 docker.sock，收集容器與系統負載 |
| Gatus | `twinproduction/gatus:v5.38.0` | 64MB | 狀態看板（Web 8088 port），定期檢查端點回應 |

四個服務的記憶體上限合計 320MB，實測四個容器加起來只用了約 57MB（`docker stats` 在閒置時的瞬間讀數）

設定上有幾個小細節：

- **內網存取與認證**：Gatus 的網頁介面不需要登入，同網段內的任何裝置連上 `http://<Mac 的內網 IP>:8088` 都能直接看到健康度看板，因此只適合作為內部狀態展示，不要直接暴露到公開網路；Beszel 第一次打開時則需要設定一組管理者帳號密碼
- **Beszel 監控的是虛擬機**：Beszel agent 唯讀掛載的是 OrbStack 的 docker.sock，所以面板上看到的 CPU 負載、記憶體與磁碟曲線，代表的是 OrbStack 分配到的 Linux 虛擬機狀態，而不是整台 macOS 本機
- **Beszel 的網路連線**：因為 hub 與 agent 放在同一個 Docker network 裡，在面板新增系統時，主機名稱要直接填容器名稱 `beszel-agent`（連接埠 45876），填主機 IP 反而會因為 Docker 內部網路路由連不上
- **通報管道**：通知一律走 Telegram，把 Bot Token 和 Chat ID 抽到權限設為 `600` 的 `.env` 檔，不放進版控

<p class="code-caption">gatus-config.yaml</p>

```yaml
endpoints:
  - name: Planka看板
    url: "http://<Mac 的內網 IP>:3201/api/config"
    interval: 1m
    conditions:
      - "[STATUS] == any(200, 401)"
    alerts:
      - type: telegram
```

這裡有個關於健康檢查的細節：我原本設定 Gatus 去打 Planka 的 `/api/health`，但這個端點只會回傳前端的靜態 HTML 頁面，不能真正代表後端 API 伺服器的存活狀態；後來改打需要後端驗證的 `/api/config`，狀態碼檢查條件設為 `[STATUS] == any(200, 401)`，只要後端正常回傳 401 Unauthorized，就代表後端程式有在回應（這裡沒有額外驗證資料庫連線）

需要坦承的是，Gatus 5.38.0 原生並沒有提供手動觸發測試告警的指令，我只用 Telegram Bot API 直接送訊息，加上 Diun 內建的 `notif test`，驗證了通訊管道與憑證都正常；Gatus 真實的失敗告警推送，還是要等未來服務真正故障時才能驗收

## 那些沒寫在教學裡的實戰踩坑

把這套監控與通知串起來的過程中，踩了幾個很有意思的坑

### 1. Telegram Chat ID 不是填 Bot 自己的 ID

設定 Diun 和 Gatus 的 Telegram 告警時，我直覺地把 Bot 的數字 ID 當成發送目標，結果 API 一直回傳 `403 Forbidden: bot can't send messages to the bot`

這才想起來 Telegram 的機制：Bot 不能對自己發訊息，它需要的是「接收者的 User ID」，必須先在 Telegram 找 `@userinfobot` 查到自己的私有帳號 ID，而且最關鍵的一步：**你必須先在 Telegram 裡主動敲那個 Bot 並按下 `/start`**，Bot 拿到發話許可後，之後的告警才送得進來

### 2. 千萬別在有本地映像的機器上打 docker image prune -a

架完監控後看了一下磁碟，想說順手清理一下用不到的舊映像，敲了 `docker image prune -a`

指令跑完後，正在運行的容器雖然沒有中斷，但回頭一查才發現：既有服務裡有兩個 Obsidian 相關的映像是用本地 build 出來的，tag 長得像 `sha256-...`，直接被 prune 當成無用映像給 untag 了，要是哪天 compose 重新建置或重啟，就會因為找不到映像而失敗

幸好底層的 layer 還在，清理幫手回報了原本的 image ID，我趕緊用 `docker tag <image id> <原 tag 名稱>` 把標籤補回來；這次學到的教訓是：在跑著各類本地 build 容器的環境裡，沒事不要亂下 `prune -a`

### 3. 清理 Docker 映像，Mac 本機的可用空間完全沒變

清完映像和建置快取之後，Docker 帳面上少了約 4.2GB 映像加 1.7GB 建置快取（兩者共用部分 layer，不能直接相加），但我興奮地在 macOS 終端機打 `df -h`，可用空間居然只從 38G 變 37G，甚至還少了一點點

原因在於 OrbStack 的虛擬磁碟檔案本質上是 sparse image，Docker 容器內部刪除了檔案，底層的虛擬磁碟檔並不會立刻把空間釋放還給 macOS 主機

真正讓我找回硬碟空間的，反而是清了 Mac 本地的套件快取：

- 刪除 `~/.bun/install/cache`（一口氣釋放 4.4GB）
- 刪除 `~/Library/Caches/go-build`（釋放 462MB）

清完這兩處快取後，Mac 的可用空間才從 42.1G 升到 45.8G

### 4. macOS 完整磁碟存取權的陷阱

在做磁碟掃描和維護時，執行指令的終端機或輔助工具需要「完整磁碟存取權（Full Disk Access）」

去系統設定裡勾選授權之後，如果沒有手動按 `Cmd + Q` 把執行中的應用程式完全關閉重開，新的磁碟存取權限是不會即時生效的，這一點卡了我好幾分鐘

## 結語：不為換而換的滿足感

讀完別人精巧的極簡架構，很容易讓人產生推倒重來的衝動，總覺得自己手上的系統不夠優雅、記憶體吃太多

但靜下心來算一筆帳：現有的容器運作穩定，資料結構跟日常習慣早已磨合好，把它們全部換掉只為了省下幾百 MB 的記憶體，除了滿足技術強迫症之外，對實際生活沒有任何幫助

反而是那篇 OpenStick 文章提醒了我一個真實的盲點：**「運作中」不等於「有掌握」**

掛上 Diun、Beszel 和 Gatus，以記憶體上限合計 320MB 的代價，換來了映像更新通知、資源監控曲線與端點存活看板，補上了原本缺少的可見度

先這樣吧，至少現在出門在外，只要服務出問題或有新映像，Telegram 會通知我，不用再憑感覺猜家裡的服務活著沒有（看板本身仍只能在內網打開）

## 參考資料

- [What I run on my $10 USD OpenStick homelab (Laurens Bosscher)](https://blog.bosscher.ch/posts/openstick/)
- [Diun 官方文件](https://crazymax.dev/diun/)
- [Beszel GitHub 儲存庫](https://github.com/henrygd/beszel)
- [Gatus 官方文件](https://gatus.io/)
