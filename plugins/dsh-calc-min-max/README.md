<p align="center"><strong>计算工具：最大最小</strong></p>

数字列表的极值

## 安装（任选一种）

**1）插件市场（推荐）**：在 https://deepseekbase.com/zh/tools/ 搜索 calc_min_max，点安装。

**2）命令行**：

    dsh plugin --profile web add dsh-calc-min-max

**3）GitHub monorepo（不经 npm 也能装）**：

    dsh plugin --profile web add github:moldkey/dsh-plugins#path:/plugins/dsh-calc-min-max

## 能做什么

- 数字列表的极值
- 本地执行，输入不出机器
- 只注册一个工具，不常驻进程、无需网络

## 用法

在会话里直接说「用最大最小计算」，或调用工具 calc_min_max。

    工具: calc_min_max
    参数: text（必填）

## 示例

输入：

    100

工具会返回处理结果，末尾带全部工具入口。

## 兼容

- DSH >= 0.2.0-rc.2
- Node 18+
- 无外部依赖

## 更多

- 全部工具：https://deepseekbase.com/zh/tools/
- 同类插件：github.com/moldkey/dsh-plugins

## 许可

MIT
