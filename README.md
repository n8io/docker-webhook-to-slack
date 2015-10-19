# Docker Webhook to Slack

![](https://dl.dropboxusercontent.com/u/452959/hosted/dw2s.png)

[![Codeship Status for NateClark/docker-webhook-to-slack](https://codeship.com/projects/b9722130-49e1-0133-2289-726ce319aba8/status?branch=development)](https://codeship.com/projects/105756)

## How to implement

### Take your Slack incoming webhook url:

* https://`hooks.slack.com`/services/T0BJTEP2P/B0BKHG10C/UaxHOHYbJxyWtLcjpw620gwY

### ... and replace the base path like so:

* https://`docker-webhook-to-slack.herokuapp.com`/services/T0BJTEP2P/B0BKHG10C/UaxHOHYbJxyWtLcjpw620gwY

### ... and you're done. The image above is the default output.

## Customizations

### Optional query string parameters

Append the following query string pairs to the url to customize more. These map 1:1 to the [Slack API](https://api.slack.com/docs/attachments).
* &icon_url=[ url for bot icon ]
* &username=[ username ]
* &pretext=[ pretext ]
* &author_icon=[ url for author icon ]
* &author_name=[ author name ]
* &author_link=[ url for author link ]
* &title=[ title ]
* &title_url=[ title_url ]
* &text=[ text ]
* &tag=[ tag ]
* &image_url=[ url for large image ]

![](https://dl.dropboxusercontent.com/u/452959/hosted/options.png)

