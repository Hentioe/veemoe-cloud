require "jwt"

module VeemoeCloud
  module Router::SignIn
    ADMIN_EMAIL     = VeemoeCloud.get_app_env("admin_email")
    ADMIN_PASSWORD  = VeemoeCloud.get_app_env("admin_password")
    BASE_SECRET_KEY = VeemoeCloud.get_app_env("base_secret_key")

    SUCCESS_MSG     = "OK"
    AUTH_FAILED_MSG = "邮箱或密码错误。"
  end

  Router.def :sign_in do
    post "/sign_in" do |env|
      data = env.params.json

      form_email = data["email"]?.as(String | Nil)
      form_password = data["password"]?.as(String | Nil)
      form_remember_me = data["remember_me"]?.as(Bool | Nil)

      body =
        if ADMIN_EMAIL == form_email && ADMIN_PASSWORD == form_password
          exp =
            if form_remember_me # 记住我，过期为 30 天
              Time.utc.to_unix + (60 * 60 * 24 * 30)
            else # 没有记住我，过期为 1 天
              Time.utc.to_unix + (60 * 60 * 24)
            end

          payload = {"user_id" => 1, "exp" => exp, "iat" => Time.utc.to_unix}
          token = JWT.encode(payload, BASE_SECRET_KEY, JWT::Algorithm::HS256)

          {msg: SUCCESS_MSG, token: token}
        else
          {msg: AUTH_FAILED_MSG}
        end

      env.response.content_type = "application/json"
      unless body["msg"] == SUCCESS_MSG
        env.response.status_code = 401
      end
      body.to_json
    end
  end
end
