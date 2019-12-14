module VeemoeCloud
  Router.def :page do
    get "/" do |context|
      render "src/views/user.html.ecr"
    end

    get "/login" do |context|
      if context.user_id? == 1
        context.redirect "/console"
      else
        render "src/views/user.html.ecr"
      end
    end

    get "/logout" do |context|
      token_cookie = HTTP::Cookie.new(
        name: "token",
        value: "",
        expires: Time.utc(1970, 1, 1)
      )

      context.response.cookies << token_cookie
      context.redirect "/"
    end

    get "/console" do |context|
      if context.user_id? == 1
        spaces = Business.find_workspace_list
        render "src/views/console.html.ecr"
      else
        context.redirect "/login"
      end
    end

    get "/console/*" do |context|
      if context.user_id? == 1
        spaces = Business.find_workspace_list
        render "src/views/console.html.ecr"
      else
        context.redirect "/login"
      end
    end

    get "/*" do |context|
      render "src/views/user.html.ecr"
    end

    error 404 do |context|
      if body = context.get? "body"
        body
      else
        "Not Found"
      end
    end
  end
end
