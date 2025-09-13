# Getting started
To run the Jigsaw App locally, follow these steps:

Prerequisites:
- Elixir and Erlang installed
- Phoenix installed

Setup
1. Clone this repository to your local machine

```
git clone https://github.com/aadya28/jigsaw-puzzle-phoenix.git
```

2. Install Elixir dependencies

```
mix deps.get
```

3. Setup assets

```
mix assets.setup
```

4. Compile dependencies

```
mix deps.compile
```

6. Start Phoenix server

```
mix phx.server
```
Or, with IEx:
```
iex -S mix phx.server
```

Now you can visit [`localhost:4000`](http://localhost:4000) from your browser.

## Learn more

  * Official website: https://www.phoenixframework.org/
  * Guides: https://hexdocs.pm/phoenix/overview.html
  * Docs: https://hexdocs.pm/phoenix
  * Forum: https://elixirforum.com/c/phoenix-forum
  * Source: https://github.com/phoenixframework/phoenix
