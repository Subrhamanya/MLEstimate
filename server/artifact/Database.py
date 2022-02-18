import decimal

import pymysql


class Database:
    def __init__(self):
        try:
            self.cur = pymysql.connect(host="localhost", user="root", password="", database="rems",
                                       cursorclass=pymysql.cursors.DictCursor)
            self.con = self.cur.cursor()
        except:
            con = None

    def escape_string(self, args):
        for i in args.keys():
            args[i] = self.cur.escape_string(str(args[i]))
        return args

    def insert(self, args, table):

        args = self.escape_string(args)

        if self.con == None:
            return False
        str = "INSERT INTO `" + table + "` (" + ','.join(list(args.keys())) + ") VALUES (" + '\'' + '\',\''.join(
            args.values()) + '\'' + ")"
        try:
            self.con.execute(str)
            self.cur.commit()
            return True
        except:
            self.cur.rollback()
            return False

    def delete(self, args, table):
        args = self.cur.escape_string(str(args))
        table= self.cur.escape_string(str(table))
        if self.con == None:
            return False

        string = "DELETE FROM `" + table + "`WHERE id=%s";

        try:
            self.con.execute(string, [args])
            self.cur.commit()
            return True
        except:
            return False

    def update(self, args, table):
        args = self.escape_string(args)

        if self.con == None:
            return False
        str = "UPDATE `" + table + "` SET name=%s,mobile_number=%s,email=%s,address=%s,password=%s WHERE id=%s"

        try:
            self.con.execute(str,
                             [args['name'], args['mobile_number'], args['email'], args['address'], args['password'],
                              args['id']])
            self.cur.commit()
            return True
        except:
            self.cur.rollback()
            return False

    def login(self, args):
        args = self.escape_string(args)
        str = "SELECT * FROM `client` WHERE email=%s AND password=%s"
        self.con.execute(str, [args['email'], args['password']])
        data = self.con.fetchall()
        if self.con.rowcount == 0:
            return False
        else:
            return data
    def admin_login(self,args):
        args = self.escape_string(args)
        str = "SELECT * FROM `admin` WHERE email=%s AND password=%s"
        self.con.execute(str, [args['email'], args['password']])
        data = self.con.fetchall()
        if self.con.rowcount == 0:
            return False
        else:
            return data

    def admin_db_schema(self):
        str = "select TABLE_NAME,GROUP_CONCAT(concat(COLUMN_NAME)) AS COLUMN_NAME from information_schema.columns where table_schema='rems' group by TABLE_NAME "
        try:
            self.con.execute(str)
            data = self.con.fetchall()
            return data
        except:
            return False

    def admin_get_data(self, table):
        string = "SELECT * FROM `" + table + "`";
        try:
            self.con.execute(string)
            data = self.con.fetchall()
            for i in data:
                if i.get('price', 0) != 0:
                    i['price'] = float(i['price'])
            return data
        except:
            return False

    def admin_query(self, query):
        try:
            self.con.execute(query)
            data = self.con.fetchall()
            for i in data:
                x = []
                for j in i.keys():
                    if type(i[j]) == type(decimal.Decimal(1)):
                        i[j] = float(i[j])
                    if '.' in j:
                        x.append(j)
                for j in x:
                    k = j.replace('.', '_')
                    i[k] = i[j]
                    del i[j]
            return data
        except Exception as e:
            return e.args[1]

    def admin_history_analysis(self):
        str="SELECT count(*) AS count,location from history GROUP BY location"
        try:
            self.con.execute(str)
            data=self.con.fetchall()
            return data
        except :
            return False

    def admin_feedback_analysis(self):
        str="SELECT COUNT(*) as count,message_type from feedback GROUP BY message_type"
        try:
            self.con.execute(str)
            data=self.con.fetchall()
            return data
        except :
            return False




