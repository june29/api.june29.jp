source "https://rubygems.org"

gem "dynomite"
gem "jets"

group :development, :test do
  # Call 'byebug' anywhere in the code to stop execution and get a debugger console
  gem "byebug", "= 11.1.2", platforms: [:mri, :mingw, :x64_mingw]
  gem "puma", "4.3.5"
  gem "rack"
  gem "shotgun"
end

group :test do
  gem "capybara"
  gem "launchy"
  gem "rspec" # rspec test group only or we get the "irb: warn: can't alias context from irb_context warning" when starting jets console
end
