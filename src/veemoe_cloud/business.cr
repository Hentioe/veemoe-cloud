require "../../config/*"

module VeemoeCloud::Business
  macro def(name)
    {{module_name = name.camelcase}}

    module Business::{{module_name.id}}
      alias {{module_name.id}} = Model::{{module_name.id}}

      {{yield}}
    end
  end
end

require "./business/*"
