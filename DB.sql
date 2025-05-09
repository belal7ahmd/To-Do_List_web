create schema todo_list;

use todo_list;
create table if not exists user_(
user_id varchar(36) primary key,
username varchar(30),
user_email longtext,
user_password longtext
);

create table if not exists list_(
list_id varchar(36) primary key,
list_title longtext,
user_id varchar(36),
time_ bigint,
foreign key (user_id) references user_(user_id) on delete cascade
);

create table if not exists todo_(
todo_id varchar(36) primary key,
todo_title longtext,
list_id varchar(36),
time_ bigint,
foreign key (list_id) references list_(list_id) on delete cascade
);
use todo_list;
drop user program@localhost;
flush privileges;
create user program@localhost identified by 'pms2013pms';

GRANT ALL ON *.* TO 'your_user_here'@'your_server_ip_here' WITH GRANT OPTION;
