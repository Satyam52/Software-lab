# BEST BIDS - Bicycle auction web app
## Submission to CS699 - Software lab  2022 🌟

[![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/Satyam52/Software-lab?logo=github&style=for-the-badge)](https://github.com/Satyam52) 
[![GitHub last commit](https://img.shields.io/github/last-commit/Satyam52/Software-lab?style=for-the-badge&logo=git)](https://github.com/Satyam52) 
[![GitHub stars](https://img.shields.io/github/stars/Satyam52/Software-lab?style=for-the-badge)](https://github.com/Satyam52/Software-lab/stargazers) 
[![My stars](https://img.shields.io/github/stars/Satyam52?affiliations=OWNER%2CCOLLABORATOR&style=for-the-badge&label=My%20stars)](https://github.com/Satyam52/Software-lab/stargazers) 
[![Code size](https://img.shields.io/github/languages/code-size/Satyam52/Software-lab?style=for-the-badge)](https://github.com/Satyam52/Software-lab)
[![Languages](https://img.shields.io/github/languages/count/Satyam52/Software-lab?style=for-the-badge)](https://github.com/Satyam52/Software-lab)
[![Top](https://img.shields.io/github/languages/top/Satyam52/Software-lab?style=for-the-badge&label=Top%20Languages)](https://github.com/Satyam52/Software-lab)

Realtime bicyle auction platform using `Cron Jobs`

<p align="center">
<a href="https://best-bids.netlify.app">
<img src="https://raw.githubusercontent.com/Satyam52/Software-lab/main/images/landing.png" alt="BEST BIDS"/>
</a>
</p>



## Features and Interfaces

1. Landing Page with Trending Posts
   - Seamless landing page with `Login` button for user Login using Auth0 authentication service 
   - ![image](https://raw.githubusercontent.com/Satyam52/Software-lab/main/images/landing2.png)
 
   - Important part of Auth0 authentication is that you can choose between Google or use any email provider
   - ![image](https://raw.githubusercontent.com/Satyam52/Software-lab/main/images/login.png)
   

2. Auctions page 
   - List of all active auctions with pagniation. User can share any auction by clicking on share icon
   - ![image](https://raw.githubusercontent.com/Satyam52/Software-lab/main/images/auctions.png)
   
3. Buyout phase
- User can purchase bicycle directly at buyout price (which is quite higher than minimum bidding price) before the action starts
- ![image](https://raw.githubusercontent.com/Satyam52/Software-lab/main/images/buyout.png)

   
4. Auction details
   - After the auction stared a user can bid thier price for the bicycle. The bicyle's description with the auction bidding trend, start, end date and time shown to user.
   - ![image](https://raw.githubusercontent.com/Satyam52/Software-lab/main/images/auction.png)
   
   - Enter the amount and press BID
   - ![image](https://raw.githubusercontent.com/Satyam52/Software-lab/main/images/bid.png)


4. Post Auction
   - A User can create an auction by clicking on POST. Enter tile (related to bicyle model and brand), auction start and end date time, buyout price, minimum bidding price and description of the auction. 
  - ![image](https://raw.githubusercontent.com/Satyam52/Software-lab/main/images/post_1.png)
  
     - Upload maximum 5 and minimum 1 image of your cycle. 
  - ![image](https://raw.githubusercontent.com/Satyam52/Software-lab/main/images/post_2.png)
  
     - Confirm and POST the auction.
  - ![image](https://raw.githubusercontent.com/Satyam52/Software-lab/main/images/post_3.png)

5. On Dashboard a user can see won auction, active bids and posted auctions. 
    - User can edit and delete posted bids and auctions.
  - ![image](https://raw.githubusercontent.com/Satyam52/Software-lab/main/images/dashboard.png)
   
## Tech stack
<div align="center">
  <a href="https://github-readme-tech-stack.vercel.app">
    <img src="https://github-readme-tech-stack.vercel.app/api/cards?title=BEST+BIDS+Tech+Stack&align=center&titleAlign=center&fontSize=20&lineHeight=10&lineCount=2&theme=ayu&width=450&bg=%25230B0E14&titleColor=%231c9eff&line1=react%2Creact%2Cauto%3B%3Bnginx%2Cnginx%2Cauto%3B%3Bauth0%2CAuth0%2Cauto%3B&line2=django%2Cdjango%2Cffffff%3Bjavascript%2Cjavascript%2Cauto%3Bcronjob%2Ccronjob%2Cauto%3B" alt="Tech Stack" />
  </a>
</div>


## Points to remember while testing the app

1. **Register/Login** before posting any auction
2. In case any **user is not broadcasted** it is probably due to server overload, **REFRESH** the window to solve this. 
3. Make sure the **URL** is starting with https
4. While **scheduling a meet** make sure the start and end date follow a logical sequence or else it’ll show an error. 
5. While testing the **Posture** bot, allow permissions for the camera and allow **notifications**, and **REFRESH** the page for changes to take effect. 
6. Wait for the model to analyze, and check for **notifications** 

## Instructions


1. `git clone https://github.com/Satyam52/Software-lab.git` 
2. `cd ./server`
3. Install python dependencies 
   - `pip install -r requirments.txt`
4. Create and migrate databasing using django ORM
    - `python manage.py makemigrations`
    - `python manage.py migrate`
5. Install rabbitmq and celery for realtime scheduling `apt install rabbitmq-server celery`
6. Start scheduling services using `bash ../start-services.sh`
5. After that start the server
    - `python manage.py runserver`
    -  server is running at http://localhost:8000
6. Now got to the client folder `cd ../client`
7. Install node dependencies
    - `npm install`
8. Create an application on Auth0
9. Create a `.env` file and fill the fields as mentioned in `.example.env`
10. Run the client `npm start`
11. The app is now running at http://localhost:3000

## Useful Links

- [Deployed Website](https://best-bids.netlify.app/)
- [Report Document](https://github.com/Satyam52/Software-lab/blob/backup/Report.pdf)

## Need help?

Feel free to contact me on [LinkedIn](https://www.linkedin.com/in/iam-abhishek/) 



```javascript

if (youEnjoyed) {
    starThisRepository();
}

```

-----------
