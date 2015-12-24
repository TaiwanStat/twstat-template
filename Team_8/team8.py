import csv

A = []
year_rank = ["",""]

def readPlayer(firstname, lastname):
    with open('players.csv') as tmpFile:
        player = csv.reader(tmpFile)
        for row in player:
            if row[1] == firstname and row[2] == lastname:
                tmpFile.close()
                return row[0]
        tmpFile.close()
        return ""

def readData(player_no):
    with open('atp_rankings_00s.csv') as tmpFile:
        c_rank_csv = csv.reader(tmpFile) 
        for row in c_rank_csv:
            if row[2] == player_no :
                year_rank = [row[0],row[1]]
                A.append(year_rank)
        tmpFile.close()



player_no = readPlayer("Andy","Murray")
print player_no
readData(player_no)
print A
print A[1][0]
