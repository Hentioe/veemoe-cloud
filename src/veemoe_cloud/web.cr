require "kemal"
require "./web/*"
require "./web/middlewares/*"

module VeemoeCloud::Web
  def self.start(port : Int, prod : Bool)
    serve_static({"gzip" => false})
    public_folder "static"
    Kemal.config.logger = LoggerHandler.new(Logging.get_logger)
    Kemal.config.env = "production" if prod

    add_handler AuthHandler.new

    Router.registry :sign_in
    Router.registry :display
    Router.registry :console_api
    Router.registry :page

    Kemal.run(args: nil, port: port)
  end
end
