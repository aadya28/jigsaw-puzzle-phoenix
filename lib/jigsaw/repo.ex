defmodule Jigsaw.Repo do
  use Ecto.Repo,
    otp_app: :jigsaw,
    adapter: Ecto.Adapters.Postgres
end
