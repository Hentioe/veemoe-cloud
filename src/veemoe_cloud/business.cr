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
