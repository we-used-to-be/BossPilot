# 项目 Agent 约束

- 执行 Git 推送时使用本机代理 `http://127.0.0.1:7897`。
- 推荐使用单次命令参数指定代理，例如：

  ```bash
  git -c http.proxy=http://127.0.0.1:7897 push origin main
  ```
