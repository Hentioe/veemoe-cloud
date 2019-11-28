require "kemal"
require "./web/*"

module VeemoeStorage::Web
  def self.start(port : Int, prod : Bool)
    serve_static({"gzip" => false})
    public_folder "static"
    Kemal.config.logger = LoggerHandler.new(Logging.get_logger)
    Kemal.config.env = "production" if prod

    get "/" do
      render "src/views/user.html.ecr"
    end

    Kemal.run(args: nil, port: port)
  end
end
