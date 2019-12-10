module VeemoeCloud::Web
  class AuthHandler < Kemal::Handler
    getter secret_key : String

    def initialize(@secret_key)
    end

    def call(context)
      if token_cookie = context.request.cookies["token"]?
        token = token_cookie.value
        begin
          payload, _ = JWT.decode(token, @secret_key, JWT::Algorithm::HS256)
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
