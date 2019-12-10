require "kemal"
require "./web/*"
require "./web/middlewares/*"

module VeemoeCloud::Web
  def self.start(port : Int, prod : Bool, res_path : String, cache_path : String)
    serve_static({"gzip" => false})
    public_folder "static"
    Kemal.config.logger = LoggerHandler.new(Logging.get_logger)
    Kemal.config.env = "production" if prod

    email, password, secret_key = {"cloud@veemoe.me", "demo123", "secret123"}

    add_handler AuthHandler.new secret_key

    Router.registry :sign_in, email, password, secret_key
    Router.registry :page
    Router.registry :display, res_path, cache_path

    Kemal.run(args: nil, port: port)
  end
end
