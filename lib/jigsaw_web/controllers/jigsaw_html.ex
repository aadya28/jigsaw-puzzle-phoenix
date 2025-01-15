defmodule JigsawWeb.JigsawHTML do
  @moduledoc """
  This module contains pages rendered by PageController.

  See the `page_html` directory for all templates available.
  """
  use JigsawWeb, :html

  embed_templates "jigsaw_html/*"
end
