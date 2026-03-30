-- TABLE: users definition
CREATE TABLE users (
	user_id int4 GENERATED ALWAYS AS IDENTITY( INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START 1 CACHE 1 NO CYCLE) NOT NULL,
	user_name varchar(100) NOT NULL,
	user_password varchar(100) NOT NULL,
	mobile_no varchar(100) NOT NULL,
	email_id varchar(255) NOT NULL,
	parent_user_id int4 NULL,
	role_id int4 NOT NULL,
	is_active bool NOT NULL,
	first_name varchar(100) NOT NULL,
	last_name varchar(100) NOT NULL,
	last_password_changed_date timestamptz NULL,
	created_by int4 NULL,
	created_date timestamptz NOT NULL,
	modified_by int4 NULL,
	modified_date timestamptz NULL,
	user_code varchar(50) NOT NULL, -- Unique User Code, based on the User Role Type
	CONSTRAINT user_code_unique_key UNIQUE (user_code),
	CONSTRAINT users_pk PRIMARY KEY (user_id),
	CONSTRAINT users_unique UNIQUE (email_id)
);
-- Column comments
COMMENT ON COLUMN users.user_code IS 'Unique User Code, based on the User Role Type';


-- TABLE: user_profiles definition
CREATE TABLE user_profiles (
	user_id int4 NOT NULL,
	gender varchar(10) NOT NULL,
	full_address varchar(255) NOT NULL,
	city varchar(100) NOT NULL,
	district varchar(100) NOT NULL,
	state varchar(100) NOT NULL,
	pincode varchar(10) NOT NULL,
	latitude numeric(9, 6) DEFAULT 0 NULL,
	longitude numeric(9, 6) DEFAULT 0 NULL,
	pan_number varchar(20) NOT NULL,
	aadhar_number varchar(20) NOT NULL,
	gst_number varchar(20) NOT NULL,
	agreement_text varchar(255) NOT NULL,
	agreement_accepted bool DEFAULT false NOT NULL,
	kyc_verified bool DEFAULT false NOT NULL,
	status varchar(20) NOT NULL,
	bank_account_holder_name varchar(150) NOT NULL,
	bank_name varchar(150) NOT NULL,
	bank_account_number varchar(50) NOT NULL,
	bank_acc_type varchar(50) NOT NULL,
	bank_ifsc_code varchar(20) NOT NULL,
	bank_verify_status varchar(20) NULL,
	is_bank_verified bool DEFAULT false NULL,
	shop_name varchar(100) NOT NULL,
	shop_full_address varchar(500) NOT NULL,
	shop_city varchar(50) NOT NULL,
	shop_state varchar(100) NOT NULL,
	shop_district varchar(120) NOT NULL,
	shop_pincode varchar(10) NOT NULL,
	extra_info text NULL,
	created_by int4 NOT NULL,
	created_date timestamptz NOT NULL,
	modified_by int4 NULL,
	modified_date timestamptz NULL,
	CONSTRAINT user_profiles_pk PRIMARY KEY (user_id),
	CONSTRAINT user_unique_aadhar_number UNIQUE (aadhar_number),
	CONSTRAINT user_unique_gst_number UNIQUE (gst_number),
	CONSTRAINT user_unique_pan_number UNIQUE (pan_number),
	CONSTRAINT user_profiles_created_by_fk FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
	CONSTRAINT user_profiles_modified_by_fk FOREIGN KEY (modified_by) REFERENCES users(user_id) ON DELETE CASCADE,
	CONSTRAINT user_profiles_users_fk FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);


-- TABLE: documents definition
CREATE TABLE documents (
	document_id int4 GENERATED ALWAYS AS IDENTITY( INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START 1 CACHE 1 NO CYCLE) NOT NULL,
	document_name varchar(255) NOT NULL,
	extension_name varchar(32) NOT NULL, -- e.g. 'jpg','png' etc
	document_type varchar(100) NOT NULL, -- e.g. 'agreement','id_proof'
	mime_type varchar(255) NULL,
	file_size int8 NULL, -- size in bytes
	checksum varchar(128) NULL, -- sha256 or sha1
	storage_provider varchar(50) DEFAULT 'local'::character varying NOT NULL, -- s3/gcs/local
	storage_key text NOT NULL, -- canonical key (eg: bucket/path or object id)
	cloud_url text NULL,
	is_public bool DEFAULT false NOT NULL, -- is publically accessible
	status varchar(50) DEFAULT 'active'::character varying NOT NULL, -- active,processing,disabled
	is_deleted bool DEFAULT false NOT NULL,
	deleted_at timestamptz NULL,
	deleted_by int8 NULL,
	created_by int4 NULL,
	created_date timestamptz NOT NULL,
	modified_by int4 NULL,
	modified_date timestamptz NULL,
	CONSTRAINT documents_pk PRIMARY KEY (document_id),
	CONSTRAINT documents_created_by_fk FOREIGN KEY (created_by) REFERENCES users(user_id) ON DELETE SET NULL,
	CONSTRAINT documents_deleted_by_fk FOREIGN KEY (deleted_by) REFERENCES users(user_id) ON DELETE SET NULL,
	CONSTRAINT documents_modified_by_fk FOREIGN KEY (modified_by) REFERENCES users(user_id) ON DELETE SET NULL
);
-- Column comments
COMMENT ON COLUMN documents.extension_name IS 'e.g. ''jpg'',''png'' etc';
COMMENT ON COLUMN documents.document_type IS 'e.g. ''agreement'',''id_proof''';
COMMENT ON COLUMN documents.file_size IS 'size in bytes';
COMMENT ON COLUMN documents.checksum IS 'sha256 or sha1';
COMMENT ON COLUMN documents.storage_provider IS 's3/gcs/local';
COMMENT ON COLUMN documents.storage_key IS 'canonical key (eg: bucket/path or object id)';
COMMENT ON COLUMN documents.is_public IS 'is public accessible';
COMMENT ON COLUMN documents.status IS 'active,processing,disabled';


-- TABLE: user_docs definition
CREATE TABLE user_docs (
	user_doc_id int4 GENERATED ALWAYS AS IDENTITY( INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START 1 CACHE 1 NO CYCLE) NOT NULL,
	user_id int4 NOT NULL,
	document_id int4 NOT NULL,
	CONSTRAINT user_docs_pk PRIMARY KEY (user_doc_id),
	CONSTRAINT user_docs_documents_fk FOREIGN KEY (document_id) REFERENCES documents(document_id) ON DELETE CASCADE,
	CONSTRAINT user_docs_user_id_fk FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);


-- TABLE: roles definition
CREATE TABLE roles (
	role_id int4 GENERATED ALWAYS AS IDENTITY( INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START 1 CACHE 1 NO CYCLE) NOT NULL,
	role_code varchar(100) NOT NULL,
	role_name varchar(100) NOT NULL,
	active_from timestamptz NULL,
	active_to timestamptz NULL,
	created_by int4 NULL,
	created_date timestamptz NOT NULL,
	modified_by int4 NULL,
	modified_date timestamptz NULL,
	CONSTRAINT roles_code_unique UNIQUE (role_code),
	CONSTRAINT roles_pk PRIMARY KEY (role_id),
	CONSTRAINT roles_created_by_fk FOREIGN KEY (created_by) REFERENCES users(user_id),
	CONSTRAINT roles_modified_by_fk FOREIGN KEY (modified_by) REFERENCES users(user_id)
);


-- TABLE: pages definition
CREATE TABLE pages (
	page_id int4 GENERATED ALWAYS AS IDENTITY( INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START 1 CACHE 1 NO CYCLE) NOT NULL,
	page_code varchar(100) NOT NULL,
	page_name varchar(100) NOT NULL,
	parent_page_code varchar(100) NULL,
	icon_code varchar(100) NULL,
	page_type_code varchar(100) NULL,
	description varchar(100) NULL,
	active_from timestamptz NULL,
	active_to timestamptz NULL,
	created_by int4 NOT NULL,
	created_date timestamptz NOT NULL,
	modified_by int4 NULL,
	modified_date timestamptz NULL,
	CONSTRAINT pages_pk PRIMARY KEY (page_id),
	CONSTRAINT pages_created_by_fk FOREIGN KEY (modified_by) REFERENCES users(user_id),
	CONSTRAINT pages_modified_by_fk FOREIGN KEY (created_by) REFERENCES users(user_id)
);


-- TABLE: page_actions definition
CREATE TABLE page_actions (
	page_action_id int4 GENERATED ALWAYS AS IDENTITY( INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START 1 CACHE 1 NO CYCLE) NOT NULL,
	page_code varchar(100) NOT NULL,
	action_code varchar(100) NOT NULL,
	accessibility varchar(10) NOT NULL, -- Y/N
	remarks varchar(255) NOT NULL,
	created_by int4 NOT NULL,
	created_date timestamptz NOT NULL,
	modified_by int4 NULL,
	modified_date timestamptz NULL,
	page_id int4 NULL,
	CONSTRAINT page_action_pk PRIMARY KEY (page_action_id),
	CONSTRAINT page_actions_created_by_fk FOREIGN KEY (created_by) REFERENCES users(user_id) ON DELETE CASCADE,
	CONSTRAINT page_actions_modified_by_fk FOREIGN KEY (modified_by) REFERENCES users(user_id) ON DELETE CASCADE,
	CONSTRAINT page_actions_pages_fk FOREIGN KEY (page_id) REFERENCES pages(page_id) ON DELETE CASCADE
);
-- Column comments
COMMENT ON COLUMN page_actions.accessibility IS 'Y/N';


-- TABLE: page_action_permissions definition
CREATE TABLE page_action_permissions (
	page_action_permission_id int4 GENERATED ALWAYS AS IDENTITY( INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START 1 CACHE 1 NO CYCLE) NOT NULL,
	page_code varchar(100) NOT NULL,
	action_code varchar(100) NOT NULL,
	role_id int4 NOT NULL,
	user_id int4 NULL,
	accessibility varchar(50) NOT NULL, -- Y/N
	created_by int4 NULL,
	created_date timestamptz NOT NULL,
	modified_by int4 NULL,
	modified_date timestamptz NULL,
	CONSTRAINT page_action_permissions_pk PRIMARY KEY (page_action_permission_id),
	CONSTRAINT page_action_permissions_created_by_fk FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
	CONSTRAINT page_action_permissions_modified_by_fk FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
	CONSTRAINT page_action_permissions_role_id_fk FOREIGN KEY (role_id) REFERENCES roles(role_id) ON DELETE CASCADE,
	CONSTRAINT page_action_permissions_user_id_fk FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);
-- Column comments
COMMENT ON COLUMN page_action_permissions.accessibility IS 'Y/N';


-- TABLE: user_sessions definition
CREATE TABLE user_sessions (
	user_session_id int4 GENERATED ALWAYS AS IDENTITY( INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START 1 CACHE 1 NO CYCLE) NOT NULL,
	user_id int4 NULL,
	session_id text NOT NULL, -- Unique UUID
	session_token text NOT NULL, -- Access Token
	refresh_token varchar NOT NULL, -- Refresh Token
	expires_at timestamptz NOT NULL,
	is_revoked bool DEFAULT false NOT NULL,
	revoked_at timestamptz NULL,
	created_by int4 NOT NULL,
	created_date timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT user_sessions_pk PRIMARY KEY (user_session_id),
	CONSTRAINT user_sessions_session_id_key UNIQUE (session_id),
	CONSTRAINT user_sessions_created_by_fk FOREIGN KEY (user_id) REFERENCES users(user_id),
	CONSTRAINT user_sessions_user_id_fk FOREIGN KEY (user_id) REFERENCES users(user_id)
);
CREATE INDEX idx_user_sessions_refresh_token ON user_sessions USING btree (refresh_token);
CREATE INDEX idx_user_sessions_session_token ON user_sessions USING btree (session_token);
CREATE INDEX idx_user_sessions_user_id ON user_sessions USING btree (user_id);
-- Column comments
COMMENT ON COLUMN user_sessions.session_id IS 'Unique UUID';
COMMENT ON COLUMN user_sessions.session_token IS 'Access Token';
COMMENT ON COLUMN user_sessions.refresh_token IS 'Refresh Token';


-- TABLE: configurations definition
CREATE TABLE configurations (
	configuration_id int4 NOT NULL,
	setting_key varchar(100) NOT NULL,
	setting_value varchar(2000) NOT NULL,
	description varchar(100) NULL,
	is_active bool DEFAULT true NOT NULL,
	created_by int4 NOT NULL,
	created_date timestamptz NOT NULL,
	modified_by int4 NULL,
	modified_date timestamptz NULL,
	internal_key varchar(50) NOT NULL,
	concurrency_key varchar(50) NOT NULL,
	CONSTRAINT configurations_pkey PRIMARY KEY (configuration_id),
	CONSTRAINT configurations_setting_key_key UNIQUE (setting_key)
);


-- TABLE: login_histories definition
CREATE TABLE login_histories (
	login_history_id int4 GENERATED ALWAYS AS IDENTITY( INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START 1 CACHE 1 NO CYCLE) NOT NULL,
	user_id int4 NULL,
	event_type varchar(100) NOT NULL,
	ip_address varchar(100) NOT NULL,
	user_agent varchar(255) NOT NULL,
	latitude varchar(40) NULL,
	longitude varchar(40) NULL,
	device_type varchar(50) NULL,
	created_by int4 NULL,
	created_date timestamptz NOT NULL,
	meta_info text NULL, -- Store Any Metadata related to login for detailed debugging
	CONSTRAINT login_history_id_pk PRIMARY KEY (login_history_id)
);
-- Column comments
COMMENT ON COLUMN login_histories.meta_info IS 'Store Any Metadata related to login for detailed debugging';


-- TABLE: common_lists definition
CREATE TABLE common_lists (
	common_list_id int4 GENERATED ALWAYS AS IDENTITY( INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START 1 CACHE 1 NO CYCLE) NOT NULL,
	table_name varchar(255) NOT NULL,
	display_text varchar(255) NOT NULL,
	value_text varchar(1000) NOT NULL,
	parent_common_list_id int4 NULL,
	sort_order int4 NOT NULL,
	status varchar(100) NOT NULL,
	info_1 varchar(500) NULL,
	info_2 varchar(500) NULL,
	info_3 varchar(100) NULL,
	info_4 varchar(100) NULL,
	created_by int4 NULL,
	created_date timestamptz NOT NULL,
	modified_by int4 NULL,
	modified_date timestamptz NULL,
	CONSTRAINT common_lists_pk PRIMARY KEY (common_list_id),
	CONSTRAINT common_lists_created_by_fk FOREIGN KEY (created_by) REFERENCES users(user_id),
	CONSTRAINT common_lists_modified_by_fk FOREIGN KEY (modified_by) REFERENCES users(user_id),
	CONSTRAINT common_lists_parent_id_fk FOREIGN KEY (parent_common_list_id) REFERENCES common_lists(common_list_id)
);


-- TABLE: email_queues definition
CREATE TABLE email_queues (
	email_queue_id int4 GENERATED ALWAYS AS IDENTITY( INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START 1 CACHE 1 NO CYCLE) NOT NULL,
	smtp_account_name varchar NOT NULL,
	from_email varchar NOT NULL,
	to_email_list varchar NOT NULL,
	cc_email_list varchar NULL,
	bcc_email_list varchar NULL,
	subject_text varchar NOT NULL,
	body_html text NOT NULL,
	body_text text NULL,
	send_status varchar(20) NOT NULL,
	queued_at timestamptz DEFAULT now() NULL,
	sent_date_time timestamptz NULL,
	processed_at timestamptz NULL,
	failed_at timestamptz NULL,
	error_text text NULL,
	retry_count int4 DEFAULT 0 NULL,
	last_retry_time timestamptz NULL,
	priority int2 DEFAULT 3 NULL,
	email_type varchar(50) NULL,
	template_id int4 NULL,
	template_variables jsonb NULL,
	created_by int4 NOT NULL,
	created_date timestamptz NOT NULL,
	modified_by int4 NULL,
	modified_date timestamptz NULL,
	CONSTRAINT email_queues_pkey PRIMARY KEY (email_queue_id),
	CONSTRAINT email_queues_priority_check CHECK ((priority = ANY (ARRAY[1, 2, 3, 4, 5]))),
	CONSTRAINT email_queues_send_status_check CHECK (((send_status)::text = ANY ((ARRAY['pending'::character varying, 'processing'::character varying, 'sent'::character varying, 'failed'::character varying])::text[]))),
	CONSTRAINT email_queues_created_by_fk FOREIGN KEY (created_by) REFERENCES users(user_id)
);


-- TABLE: external_service_logs definition
CREATE TABLE external_service_logs (
	external_service_logs_id int4 GENERATED ALWAYS AS IDENTITY( INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START 1 CACHE 1 NO CYCLE) NOT NULL,
	internal_request_id varchar(50) NULL, -- Backend Internal Request Id. Can be used to find the log as well.
	api_request_id varchar(100) NULL, -- Request Id Passed with external API
	user_id int4 NULL,
	service_name varchar(100) NOT NULL, -- Name of the API
	service_http_method varchar(10) NOT NULL, -- GET,POST,PATCH, etc.
	service_url varchar(500) NOT NULL, -- URL Which is being hit
	request_payload jsonb NOT NULL, -- API Request Payload
	response_payload jsonb NULL, -- API Response Body
	status varchar(20) NOT NULL, -- If it is success or fail
	error_message text NULL,
	duration_ms int4 NULL,
	header_data jsonb NULL, -- The Header Passed in the API Call
	info_1 text NULL, -- Store any Third Additional Information in Info 1
	info_2 varchar(255) NULL, -- Store any Third Additional Information in Info 3
	info_3 varchar(255) NULL, -- Store any Third Additional Information in Info 3
	info_4 varchar(255) NULL, -- Store any Third Additional Information in Info 4
	created_by int4 NULL,
	created_date timestamptz NOT NULL,
	modified_by int4 NULL,
	modified_date timestamptz NULL,
	CONSTRAINT external_service_logs_pk PRIMARY KEY (external_service_logs_id),
	CONSTRAINT external_service_logs_created_by_fk FOREIGN KEY (created_by) REFERENCES users(user_id),
	CONSTRAINT external_service_logs_modified_by_fk FOREIGN KEY (modified_by) REFERENCES users(user_id),
	CONSTRAINT external_service_logs_users_fk FOREIGN KEY (user_id) REFERENCES users(user_id)
);
CREATE INDEX idx_api_name ON external_service_logs USING btree (service_name);
CREATE INDEX idx_request_id ON external_service_logs USING btree (api_request_id);
CREATE INDEX idx_user_id ON external_service_logs USING btree (user_id);
-- Column comments
COMMENT ON COLUMN external_service_logs.api_request_id IS 'Request Id Passed with external API';
COMMENT ON COLUMN external_service_logs.service_name IS 'Name of the API';
COMMENT ON COLUMN external_service_logs.service_http_method IS 'GET,POST,PATCH, etc.';
COMMENT ON COLUMN external_service_logs.service_url IS 'URL Which is being hit';
COMMENT ON COLUMN external_service_logs.request_payload IS 'API Request Payload';
COMMENT ON COLUMN external_service_logs.response_payload IS 'API Response Body';
COMMENT ON COLUMN external_service_logs.status IS 'If it is success or fail';
COMMENT ON COLUMN external_service_logs.header_data IS 'The Header Passed in the API Call';
COMMENT ON COLUMN external_service_logs.info_1 IS 'Store any Third Additional Information in Info 1';
COMMENT ON COLUMN external_service_logs.info_2 IS 'Store any Third Additional Information in Info 3';
COMMENT ON COLUMN external_service_logs.info_3 IS 'Store any Third Additional Information in Info 3';
COMMENT ON COLUMN external_service_logs.info_4 IS 'Store any Third Additional Information in Info 4';
COMMENT ON COLUMN external_service_logs.internal_request_id IS 'Backend Internal Request Id. Can be used to find the log as well.';


-- TABLE: idempotency_keys definition
CREATE TABLE idempotency_keys (
	idempotency_key_id int4 GENERATED ALWAYS AS IDENTITY( INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START 1 CACHE 1 NO CYCLE) NOT NULL,
	idempotency_key varchar(200) NOT NULL, -- Unique id such as uuid to be Stored
	user_id int4 NULL,
	user_service_id text NULL,
	request_hash text NULL, -- Hash of the Request
	status varchar(20) NOT NULL, -- processing/completed/failed
	response_code int4 NULL,
	response_body jsonb NULL,
	created_date timestamptz NOT NULL,
	modified_date timestamptz NULL,
	expire_at timestamptz NULL,
	CONSTRAINT idempotency_keys_pkey PRIMARY KEY (idempotency_key_id),
	CONSTRAINT idempotency_keys_unique_key UNIQUE (idempotency_key)
);
CREATE UNIQUE INDEX ux_idempotency_key_user_endpoint ON idempotency_keys USING btree (idempotency_key, user_id);
-- Column comments
COMMENT ON COLUMN idempotency_keys.idempotency_key IS 'Unique id such as uuid to be Stored';
COMMENT ON COLUMN idempotency_keys.request_hash IS 'Hash of the Request';
COMMENT ON COLUMN idempotency_keys.status IS 'processing/completed/failed';


-- TABLE: complaints definition
CREATE TABLE complaints (
	complaint_id int4 GENERATED ALWAYS AS IDENTITY( INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START 1 CACHE 1 NO CYCLE) NOT NULL,
	complaint_code varchar(30) NOT NULL, -- Unique Complaint Code to be Exposed to Frontend and not the primary key
	title varchar(100) NOT NULL,
	description text NULL,
	category varchar(100) NOT NULL, -- Service, Billing, Transactional, Technical, Other
	status varchar(100) NOT NULL, -- open, in_progress, resolved, rejected, escalated
	priority varchar(100) NOT NULL, -- low, medium, high, urgent
	attachment_id int4 NULL,
	assigned_to int4 NULL,
	resolved_by int4 NULL,
	resolved_date timestamptz NULL,
	resolved_remarks varchar(500) NULL,
	response_message text NULL,
	is_escalated bool DEFAULT false NULL,
	created_by int4 NOT NULL,
	created_date timestamptz DEFAULT now() NOT NULL,
	modified_by int4 NULL,
	modified_date timestamptz NULL,
	CONSTRAINT complaint_code_unique_key UNIQUE (complaint_code),
	CONSTRAINT complaints_pkey PRIMARY KEY (complaint_id),
	CONSTRAINT complaints_assigned_to_fk FOREIGN KEY (assigned_to) REFERENCES users(user_id) ON DELETE SET NULL,
	CONSTRAINT complaints_created_by_fk FOREIGN KEY (created_by) REFERENCES users(user_id) ON DELETE CASCADE,
	CONSTRAINT complaints_modified_by_fk FOREIGN KEY (modified_by) REFERENCES users(user_id) ON DELETE SET NULL,
	CONSTRAINT complaints_resolved_by_fk FOREIGN KEY (resolved_by) REFERENCES users(user_id) ON DELETE SET NULL
);
-- Column comments
COMMENT ON COLUMN complaints.complaint_code IS 'Unique Complaint Code to be Exposed to Frontend and not the primary key';
COMMENT ON COLUMN complaints.category IS 'Service, Billing, Transactional, Technical, Other';
COMMENT ON COLUMN complaints.status IS 'open, in_progress, resolved, rejected, escalated';
COMMENT ON COLUMN complaints.priority IS 'low, medium, high, urgent';