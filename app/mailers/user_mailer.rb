class UserMailer < ActionMailer::Base
  default from: "hello@unisphere.eu"
  
  def welcome_email(id, name, email)
    @id = id
    @name = name
    @url  = 'https://unisphereapp.scalingo.io/confirmation?confid=' + @id.to_s
    mail(to: email, subject: 'Welcome to Unisphere')
  end
  
  def invitation_email(id, inviter, name, email, group)
    @id = id
    @inviter = inviter
    @name = name
    @group = group
    @url  = 'https://unisphereapp.scalingo.io/confirmation?id=' + @id.to_s
    mail(to: email, subject: 'You have been invited by #{inviter} to join Unisphere')
  end
  
end