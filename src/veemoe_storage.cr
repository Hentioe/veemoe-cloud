require "digests"
require "./veemoe_storage/cli"
require "./veemoe_storage/logging"
require "./veemoe_storage/web"

VeemoeStorage::CLI.def_action "VeemoeStorage.start", exclude: ENV["VEEMOE_STORAGE_ENV"]? == "test"

module VeemoeStorage
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
