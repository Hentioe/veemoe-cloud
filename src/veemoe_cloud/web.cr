require "kemal"
require "./web/*"

module VeemoeCloud::Web
  def self.start(port : Int, prod : Bool, res_path : String, cache_path : String)
    serve_static({"gzip" => false})
    public_folder "static"
    Kemal.config.logger = LoggerHandler.new(Logging.get_logger)
    Kemal.config.env = "production" if prod

    Router.registry :page
    Router.registry :display, res_path, cache_path

    Kemal.run(args: nil, port: port)
  end
end
