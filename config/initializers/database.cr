require "jennifer"
require "jennifer_sqlite3_adapter"

Jennifer::Config.configure do |conf|
  conf.host = "."
  conf.adapter = "sqlite3"
  conf.local_time_zone_name = "UTC"

  env = ENV["VEEMOE_CLOUD_ENV"]? || "dev"
  conf.host = ENV["VEEMOE_CLOUD_DATABASE_HOST"]? || "./data"
  conf.db = "#{env}.db"

  level = env == "prod" ? Logger::INFO : Logger::DEBUG
  conf.logger.level = level
end

if uri = ENV["VEEMOE_CLOUD_DATABASE_URI"]?
  Jennifer::Config.from_uri uri
end
