# ECS 部署说明

仓库 workflow 会构建 VitePress 站点、运行工作台冒烟测试，并将静态站点和 Node 工作台上传到 `/var/www/psy-tutorial/releases/<commit-sha>/`。激活脚本通过 `current` 符号链接切换版本，并将工作台数据链接到 `/var/www/psy-tutorial/data/`；工作台本机健康检查或站点健康检查失败会恢复上一个版本。

## 一次性服务器准备

创建受限部署用户和目录，并让该用户拥有目录写权限：

```bash
sudo useradd --system --home /var/www/psy-tutorial --shell /usr/sbin/nologin psy-tutorial
sudo mkdir -p /var/www/psy-tutorial/{releases,bin}
sudo chown -R psy-tutorial:psy-tutorial /var/www/psy-tutorial
```

把 `psy-research-workbench.service` 安装到 `/etc/systemd/system/`，确认服务器上的 Node 路径与 `ExecStart` 一致，然后执行：

```bash
sudo systemctl daemon-reload
sudo systemctl enable psy-research-workbench
```

为部署用户配置只允许重启这个服务的 sudo 规则，例如 `/etc/sudoers.d/psy-tutorial-deploy`：

```text
psy-tutorial ALL=(root) NOPASSWD: /usr/bin/systemctl restart psy-research-workbench
```

Nginx 需要保留原来的静态站点根目录，并增加：

```nginx
location /research/ {
    proxy_pass http://127.0.0.1:4174;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
}

location /api/ {
    proxy_pass http://127.0.0.1:4174;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
}
```

激活脚本部署后，第一次可以手动检查 release 目录和服务日志，再让 Nginx 指向 release 的 `site/`；确认无误后再将 Nginx 静态根目录切换到 `/var/www/psy-tutorial/current/site`。

## GitHub 配置

在 `production` environment 配置：

- Secrets: `ALIYUN_SSH_PRIVATE_KEY`, `ALIYUN_KNOWN_HOSTS`
- Variables: `ALIYUN_HOST`, `ALIYUN_PORT`, `ALIYUN_USER`, `ALIYUN_DEPLOY_ROOT`, `DEPLOY_HEALTHCHECK_URL`

`DEPLOY_HEALTHCHECK_URL` 应指向部署后可访问的站点首页。尚无域名和证书时可暂用 `http://<ECS 公网 IP>/`，配置好域名与证书后再改为 `https://example.com/`。HTTP 仅用于健康检查，不会替站点提供传输加密。workflow 不会调用 `ssh-keyscan`，请在确认服务器指纹后保存 known hosts。

## 手动回滚

```bash
sudo -u psy-tutorial ln -sfn /var/www/psy-tutorial/releases/<previous-sha> /var/www/psy-tutorial/.current-rollback
sudo -u psy-tutorial mv -Tf /var/www/psy-tutorial/.current-rollback /var/www/psy-tutorial/current
sudo systemctl restart psy-research-workbench
```
