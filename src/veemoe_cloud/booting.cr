module VeemoeCloud
  if ENV["VEEMOE_CLOUD_ENV"]? == "test"
    ENV["VEEMOE_CLOUD_SOURCE_PATH"] = "./_res"
    ENV["VEEMOE_CLOUD_CACHE_PATH"] = "./_cache"
    ENV["VEEMOE_CLOUD_ADMIN_EMAIL"] = "cloud@veemoe.me"
    ENV["VEEMOE_CLOUD_ADMIN_PASSWORD"] = "demo123"
    ENV["VEEMOE_CLOUD_BASE_SECRET_KEY"] = "secret123"
  end
end
