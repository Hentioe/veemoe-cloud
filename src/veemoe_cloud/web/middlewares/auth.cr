module VeemoeCloud::Web
  class AuthHandler < Kemal::Handler
    BASE_SECRET_KEY = VeemoeCloud.get_app_env("base_secret_key")

    def initialize
    end

    def call(context)
      if token_cookie = context.request.cookies["token"]?
        token = token_cookie.value
        begin
          payload, _ = JWT.decode(token, BASE_SECRET_KEY, JWT::Algorithm::HS256)
          if (payload["exp"]? || JSON::Any.new(0_i64)).as_i64 > Time.utc.to_unix
            context.user_id = (payload["user_id"]? || JSON::Any.new(0_i64)).as_i
          end
        rescue e
          token_cookie = HTTP::Cookie.new(
            name: "token",
            value: "",
            expires: Time.utc(1970, 1, 1)
          )

          context.response.cookies << token_cookie
        end
      end
      call_next context
    end
  end
end
