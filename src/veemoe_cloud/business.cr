require "../../config/*"

module VeemoeCloud::Business
  macro def(name, options = {:by_name => false})
    {{module_name = name.camelcase}}

    module Business::{{module_name.id}}
      alias {{module_name.id}} = Model::{{module_name.id}}

      def self.get(id : Int32)
        Model::{{module_name.id}}.find(id)
      end

      {% if options[:by_name] == true %}
        def self.find_by_name(name)
          Model::{{module_name.id}}.where { _name == name }.first
        end
      {% end %}

      {{yield}}
    end
  end
end

require "./business/*"

module VeemoeCloud::Business
  private macro defdelegate(name, *args, to method)
    def self.{{name.id}}(*args, **options)
      {{method.id}}(*args, **options)
    end
  end

  defdelegate :get_workspace, to: Workspace.get
  defdelegate :find_workspace_list, to: Workspace.find_list
  defdelegate :create_workspace!, to: Workspace.create!
  defdelegate :update_workspace!, to: Workspace.update!
  defdelegate :delete_workspace!, to: Workspace.delete!

  defdelegate :create_style!, to: Style.create!
  defdelegate :update_style!, to: Style.update!
  defdelegate :delete_style, to: Style.delete

  defdelegate :create_pipe!, to: Pipe.create!
  defdelegate :update_pipe!, to: Pipe.update!
  defdelegate :delete_pipe, to: Pipe.delete

  defdelegate :create_match!, to: Match.create!
  defdelegate :update_match!, to: Match.update!
  defdelegate :delete_match, to: Match.delete
end
