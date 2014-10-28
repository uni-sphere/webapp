Lms::Application.routes.draw do

  resources :users do
    collection do 
      post :import_for_creating
      post :import_for_involving
    end
		resources :calendars, :only => [:new, :create, :destroy, :index, :show] do
			resources :events, :only => [:create, :new, :update, :edit, :destroy, :index]
		end
    resources :notifications, :only => [:index]  
		resources :groups do
      member do
        get 'autocomplete'
        patch 'send_invitation'
      end
			resources :tasks, :only => [:create, :edit, :update, :index, :destroy]
			resources :documents, :except => [:show]
		  resources :microposts, :only => [:create]
  		resources :calendars, :only => [:new, :create, :destroy, :index, :show] do
  			resources :events, :only => [:create, :new, :update, :edit, :destroy]
  		end
      resources :etherpads, :only => [:create, :destroy, :show]
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
