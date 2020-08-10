require "open-uri"

class NikkiController < ApplicationController
  class NikkiNotFound < StandardError; end

  rescue_from OpenURI::HTTPError, with: :render_404
  rescue_from NikkiNotFound, with: :render_404

  def index
    url = "https://scrapbox.io/api/pages/june29/#{CGI.escape('日記')}"
    data = JSON.parse(URI.open(url).read)
    @nikkis =
      data.dig("relatedPages", "links1hop").select { |page|
        page.dig("title").starts_with?(Regexp.compile("\\d{4}-\\d{2}-\\d{2} \\w{3} : "))
      }.sort_by { |page| page.dig("title") }.reverse
  end

  def show
    date = params[:date]
    data = JSON.parse(URI.open("https://scrapbox.io/api/pages/june29/#{date}").read)
    nikki = data.dig("relatedPages", "links1hop").find { |page|
      page.dig("title").starts_with?(Regexp.compile("#{date} \\w{3} : "))
    }

    raise NikkiNotFound if nikki.nil?

    page_name = CGI.escape(nikki.dig("title").gsub(" ", "_"))
    redirect_to "https://scrapbox.io/june29/#{page_name}"
  end

  def render_404
    render(plain: "404 Nikki Not Found", status: 404)
  end
end
