require "open-uri"

class NikkiController < ApplicationController
  def show
    date = params[:date]
    data = JSON.parse(URI.open("https://scrapbox.io/api/pages/june29/#{date}").read)
    nikki = data.dig("relatedPages", "links1hop").find { |page|
      page.dig("title").starts_with?(Regexp.compile("#{date} \\w{3} : "))
    }
    page_name = CGI.escape(nikki.dig("title").gsub(" ", "_"))

    redirect_to "https://scrapbox.io/june29/#{page_name}"
  end
end
