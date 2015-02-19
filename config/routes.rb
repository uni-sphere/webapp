Lms::Application.routes.draw do

  resources :users do
    collection do 
      post :import_for_creating
      post :import_for_involving
    end
		resources :calendars, only: [:new, :create, :destroy, :index, :show] do
			resources :events, only: [:create, :new, :update, :edit, :destroy, :index]
		end
    resources :notifications, only: [:index]  
		resources :groups do
      member do
        get 'autocomplete'
        patch 'send_invitation'
      end
      resources :courses, only: [:index, :create, :update, :destroy] do
        resources :evaluations, only: [:create, :update, :destroy] do
          resources :marks, only: [:index, :update]
        end
      end 
			resources :tasks, only: [:create, :edit, :update, :index, :destroy]
		  resources :microposts, only: [:create]
  		resources :calendars, only: [:new, :create, :destroy, :index, :show] do
  			resources :events, only: [:create, :new, :update, :edit, :destroy, :index]
  		end
      resources :etherpads, only: [:create, :destroy, :show]
		end
	end	

  resources :sessions, only: [:new, :create, :destroy]

  root to: 'signin#new'

  get '/signup',  to: 'users#new'
  get '/signin',  to: 'signin#new'
  delete '/signout', to: 'signin#destroy'

  get '/users/:user_id/allgroups', to: 'groups#show_all', as: 'allgroups'
  post '/user/:user_id/group/:group_id', to: 'groups#join_group', as: 'joingroup'
  delete '/user/:user_id/group/:group_id', to: 'groups#leave_group', as: 'leavegroup'
  
  put '/users/:user_id/viewparams', to: 'viewparams#update', as: 'params'
  
  get '/users/:user_id/groups/:group_id/courses/:course_id/evaluations/:evaluation_id/marks/average', to: 'evaluations#get_average', as: 'get_average_evaluation'
  get '/users/:user_id/groups/:group_id/courses/:course_id/average', to: 'courses#get_average', as: 'get_average_course'
  
  ###########
  ### box ###
  ###########
  
  # oauth
  
  get '/user/send_oauth', to: 'oauths#send_oauth', as: 'send_oauth'
  get '/user/receive_oauth', to: 'oauths#receive_oauth', as: 'receive_oauth' 
  
  # perso #

  get '/user/documents', to: 'simpledocuments#index', as: 'get_user_documents'
  get '/user/file/download', to: 'simpledocuments#download', as: 'download_user_file'
  get '/user/document/show', to: 'simpledocuments#show', as: 'show_user_file'
  get '/user/document/arianewire', to: 'simpledocuments#ariane_wire', as: 'get_document_ariane_wire'
  get '/user/document/previousfolder', to: 'simpledocuments#previous_folder', as: 'get_user_previous_folder'
  
  post '/user/file/upload', to: 'simpledocuments#upload_file', as: 'upload_user_file'
  post 'user/create_folder', to: 'simpledocuments#create_folder', as: 'create_user_folder'
  post 'user/file/create_shared_link', to: 'simpledocuments#create_shared_link', as: 'create_shared_link'
  
  put '/user/file/rename', to: 'simpledocuments#update', as: 'rename_user_file'
  put '/user/folder/rename', to: 'simpledocuments#update', as: 'rename_user_folder'
  
  put '/user/file/move', to: 'simpledocuments#move_file', as: 'move_user_file'
  put '/user/folder/move', to: 'simpledocuments#move_folder', as: 'move_user_folder'
  
  delete '/user/document/delete', to: 'simpledocuments#destroy', as: 'delete_user_document' 
  
  # group #
  
  get '/user/group/documents', to: 'groupdocuments#read_folder', as: 'get_group_documents'
  get '/user/group/document/download', to: 'groupdocuments#download_file', as: 'download_group_file'
  get '/user/group/document/read', to: 'groupdocuments#read_file', as: 'read_group_file'
  
  post '/user/group/file/create', to: 'groupdocuments#create_file', as: 'create_group_file'
  post '/user/group/folder/create', to: 'groupdocuments#create_folder', as: 'create_group_folder'
  post '/user/group/file/create_shared_link', to: 'groupdocuments#create_shared_link', as: 'create_group_shared_link'
  
  put '/user/group/file/move', to: 'groupdocuments#move_file', as: 'move_group_file'
  put '/user/group/folder/move', to: 'groupdocuments#move_folder', as: 'move_group_folder'
  put '/user/group/file/rename', to: 'groupdocuments#rename_file', as: 'rename_group_file'
  put '/user/group/folder/rename', to: 'groupdocuments#rename_folder', as: 'rename_group_folder'

  delete '/user/group/document/file/delete', to: 'groupdocuments#destroy_file', as: 'delete_group_file'
  delete '/user/group/document/folder/delete', to: 'groupdocuments#destroy_folder', as: 'delete_group_folder'
  
  ############
  ### chat ###
  ############
  
  get '/user/group/chats', to: 'groupchats#index', as: 'get_group_chats'
  post '/user/group/chat/message/create', to: 'messages#create', as: 'create_message'
  post '/user/group/chat/chat/create', to: 'groupchats#create', as: 'create_chat'
  
end
