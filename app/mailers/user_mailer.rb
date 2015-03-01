class UserMailer < ActionMailer::Base
  default from: "hello@unisphere.eu"
  
  def welcome_email(id, name, email)
    @id = id
    @name = name
    @url  = 'https://unisphereapp.scalingo.io/confirmation?confid=' + @id.to_s
    mail(to: email, subject: 'Welcome to Unisphere')
  end
  
end