# offers-api
api that retrieves offers based on search criteria
# backend
powered by mongo db

# http-stack
graph ql powered express apollo server

# primary end point
/api/search
# Testing Live Version with Curl
curl -X POST -H "Content-Type: application/json" -d '{"query": "{search (term: \"save\" ) {id,offerVendorBrand,offerLogoVendorSquare,offerHeaderLong,offerDestinationUrl}}"}' https://vertical-reason-269719.appspot.com/api/search

# short comings
Creating an index on search call is not desired
should split out server.js into controllser and so forth

# build
npm run build
cd dist
npm run start

# iterative development
npm start dev 