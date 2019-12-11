module VeemoeCloud
  Router.def :console_api, options: {:prefix => "/console/api"} do
    get "/workspaces" do |context|
      json(context, Business.find_workspace_list)
    end

    post "/workspaces" do |context|
      body = context.params.json

      space = Business.create_workspace!({
        :name        => body["name"].as(String),
        :description => body["description"].as(String),
      })

      json(context, space)
    end

    put "/workspaces/:id" do |context|
      body = context.params.json
      id = context.params.url["id"].to_i

      if space = Business.get_workspace(id)
        Business.update_workspace!(space, {
          :name        => body["name"].as(String),
          :description => body["description"].as(String),
        })
        json(context, space)
      else
        json_error(context, "No Workspace found, id: #{id}", status_code: 404)
      end
    end

    delete "/workspaces/:id" do |context|
      id = context.params.url["id"].to_i

      if space = Business.get_workspace(id)
        Business.delete_workspace!(space)
        json(context, OK)
      else
        json_error(context, "No Workspace found, id: #{id}", status_code: 404)
      end
    end
  end
end
