module GroupsHelper
  
  def channel_key
    chars = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ0123456789'
    password = ''
    6.times { password << chars[rand(chars.size)] }
    password
  end
  
  
end
