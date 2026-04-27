# Skill: get-profile

## Summary
Retrieve Josh Wang's full profile in Markdown format via HTTP content negotiation.

## Usage

Send a GET request to the homepage with `Accept: text/markdown`:

```http
GET / HTTP/1.1
Host: profile.joshwang.dev
Accept: text/markdown
```

The server will respond with `Content-Type: text/markdown; charset=utf-8` containing the full profile.

## Response Fields

- Name, title, location, years of experience
- Work experience (companies, roles, highlights)
- Technical skills by category
- Contact information

## Endpoint

`GET https://profile.joshwang.dev/`

## Parameters

None required.

## Example

```bash
curl -H "Accept: text/markdown" https://profile.joshwang.dev/
```
