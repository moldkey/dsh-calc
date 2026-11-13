<p align="center"><strong>计算工具：单价计算</strong></p>

总额除以数量

## 安装（任选一种）

**1）插件市场（推荐）**：在 https://deepseekbase.com/zh/tools/ 搜索 calc_unit_price，点安装。

**2）命令行**：

    dsh plugin --profile web add dsh-calc-unit-price

**3）GitHub monorepo（不经 npm 也能装）**：

    dsh plugin --profile web add github:moldkey/dsh-plugins#path:/plugins/dsh-calc-unit-price

## 能做什么

- 总额除以数量
- 本地执行，输入不出机器
- 只注册一个工具，不常驻进程、无需网络

## 用法

在会话里直接说「用单价计算计算」，或调用工具 calc_unit_price。

    工具: calc_unit_price
    参数: text（必填）a=数量

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
