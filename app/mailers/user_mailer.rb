class UserMailer < ActionMailer::Base
  default from: "clement_muller@hotmail.fr"
  
  def welcome_email(id, name, email)
    @id = id
    @name = name
    @url  = 'https://unisphereapp.scalingo.io/signin?confirmation=' + @id.to_s
    mail(to: email, subject: 'Welcome to Unisphere')
  end
  
end