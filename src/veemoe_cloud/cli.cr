require "clicr"

module VeemoeCloud::CLI
  macro def_action(action, exclude = false)
    def cli_run
      Clicr.create(
        name: "veemoe-cloud",
        info: "Veemoe's cloud storage services",
        action: {{action}},
        variables: {
          port: {
            info:    "Web server port",
            default: 8080,
          },
          log_level: {
            info:    "Log level",
            default: "info",
          },
        },
        options: {
          prod: {
            info: "Running in prod mode",
          },
        }
      )
    end

    begin
      cli_run unless {{exclude}}
    rescue ex : Clicr::Help
      puts ex; exit 0
    rescue ex : Clicr::ArgumentRequired | Clicr::UnknownCommand | Clicr::UnknownOption | Clicr::UnknownVariable
      abort ex
    rescue ex
      raise ex
    end
  end
end
