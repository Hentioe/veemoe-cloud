require "jwt"

module VeemoeCloud
  module Router::SignIn
    SUCCESS_MSG     = "OK"
    AUTH_FAILED_MSG = "邮箱或密码错误。"
  end

  Router.def :sign_in, email : String, password : String, secret_key do
    post "/sign_in" do |env|
      data = env.params.json

      form_email = data["email"]?.as(String | Nil)
      form_password = data["password"]?.as(String | Nil)
      form_remember_me = data["remember_me"]?.as(Bool | Nil)

      body =
        if email == form_email && password == form_password
          exp =
            if form_remember_me # 记住我，过期为 30 天
              Time.utc.to_unix + (60 * 60 * 24 * 30)
            else # 没有记住我，过期为 1 天
              Time.utc.to_unix + (60 * 60 * 24)
            end

          payload = {"user_id" => 1, exp => exp}
          token = JWT.encode(payload, secret_key, JWT::Algorithm::HS256)

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
