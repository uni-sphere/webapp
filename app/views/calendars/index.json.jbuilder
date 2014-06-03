json.array!(@calendars) do |calendar|
  json.extract! calendar, :id, :user_id, :name
  json.url user_url(user, format: :json)
end
