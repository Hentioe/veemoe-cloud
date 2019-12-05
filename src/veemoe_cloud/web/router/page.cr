module VeemoeCloud
  Router.def :page do
    get "/" do
      render "src/views/user.html.ecr"
    end

    error 404 do
      "Not Found"
    end
  end
end
