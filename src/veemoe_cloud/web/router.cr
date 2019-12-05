module VeemoeCloud::Router
  macro registry(module_name, *args)
    {{ module_name = module_name.camelcase }}
    {% if args.size > 0 %}
      {{@type}}::{{module_name.id}}.init({{*args}})
    {% else %}
      {{@type}}::{{module_name.id}}.init
    {% end %}
  end

  macro def(name, *args)
    module Router::{{name.camelcase.id}}
      def self.init({{*args}})
        {{yield}}
      end
    end
  end
end

require "./router/*"
