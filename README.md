# 备忘

## 合并视频方式一：
````
find *.mp4 | sed 's:\ :\\\ :g'| sed -e "s/'/'\\\\''/g;s/\(.*\)/'\1'/" | sed 's/^/file /' > fl.txt; ffmpeg -f concat -safe 0 -i fl.txt -c:v h264 -c:a aac output.mp4; rm fl.txt
````

## 合并视频方式二：
````
ffmpeg -i input1.mp4 -i input2.mp4 -i input3.mp4 -i input4.mp4 -i input5.mp4 -filter_complex "[0:v:0][0:a:0][1:v:0][1:a:0][2:v:0][2:a:0][3:v:0][3:a:0][4:v:0][4:a:0]concat=n=5:v=1:a=1[outv][outa]" -map "[outv]" -map "[outa]" output.mp4
````