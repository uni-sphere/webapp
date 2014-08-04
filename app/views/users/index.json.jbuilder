json.array!(@users) do |user|
  json.extract! user, :id, :name, :email, :salt, :encrypt_password
  json.url user_url(user, format: :json)
end
