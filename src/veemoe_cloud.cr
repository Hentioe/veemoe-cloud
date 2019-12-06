require "digests"
require "./veemoe_cloud/cli"
require "./veemoe_cloud/logging"
require "./veemoe_cloud/web"
require "./veemoe_cloud/mime_types"

VeemoeCloud::CLI.def_action "VeemoeCloud.start", exclude: ENV["VEEMOE_CLOUD_ENV"]? == "test"

module VeemoeCloud
  def self.start(port, log_level, res_path, cache_path, prod)
    # 初始化日志
    Logging.init(log_level)
    Logging.info "ready to start"

    # 初始化 Digests
    unless prod
      ENV["DIGESTS_ENV"] = "dev"
    else
      Digests.init # Default "static"
    end

    # 启动 web 服务
    Web.start port.to_i, prod, res_path, cache_path
  end
end
