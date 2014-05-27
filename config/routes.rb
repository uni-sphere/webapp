Lms::Application.routes.draw do

  resources :users do
	resources :groups do
		resources :documents, :except => [:show]
		end
	resources :documents, :except => [:show]
	end	

  resources :sessions, :only => [:new, :create, :destroy]

  root :to => 'sessions#new'

  get '/signup',  :to => 'users#new'
  get '/signin',  :to => 'sessions#new'
  delete '/signout', :to => 'sessions#destroy'

  get '/users/:user_id/allgroups', :to => 'groups#show_all', as: 'allgroups'
  post '/user/:user_id/group/:group_id', :to => 'groups#join_group', as: 'joingroup'
  delete '/user/:user_id/group/:group_id', :to => 'groups#leave_group', as: 'leavegroup'

end
