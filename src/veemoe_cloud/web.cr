require "kemal"
require "./web/*"
require "./web/middlewares/*"

module VeemoeCloud::Web
  def self.start(
    port : Int,
    prod : Bool,
    res_path : String,
    cache_path : String,
    admin_email : String,
    admin_password : String,
    base_secret_key : String
  )
    serve_static({"gzip" => false})
    public_folder "static"
    Kemal.config.logger = LoggerHandler.new(Logging.get_logger)
    Kemal.config.env = "production" if prod

    add_handler AuthHandler.new base_secret_key

    Router.registry :sign_in, admin_email, admin_password, base_secret_key
    Router.registry :display, res_path, cache_path
    Router.registry :console_api, res_path
    Router.registry :page

    Kemal.run(args: nil, port: port)
  end
end
