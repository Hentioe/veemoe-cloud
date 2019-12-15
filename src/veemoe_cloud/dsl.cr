module VeemoeCloud
  macro get_app_env(name)
    ENV["VEEMOE_CLOUD_{{name.upcase.id}}"]
  end
end
