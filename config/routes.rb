Jets.application.routes.draw do
  get "/nikki/:date", to: "nikki#show", constraints: { date: /^\d{4}-\d{2}-\d{2}$/ }
  get "/nikki", to: "nikki#index", as: "nikkis"
  get "/", to: "top#index", as: "top"

  # The jets/public#show controller can serve static utf8 content out of the public folder.
  # Note, as part of the deploy process Jets uploads files in the public folder to s3
  # and serves them out of s3 directly. S3 is well suited to serve static assets.
  # More info here: https://rubyonjets.com/docs/extras/assets-serving/
  any "*catchall", to: "jets/public#show"
end
