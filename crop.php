<?php
    $imageUrlObject = file_get_contents('php://input');
    $imageData = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $imageUrlObject));
    
    if($imageData === false) {
        throw new \Exception('base64_decode failed');
    }
    
    $filename = 'image.png';
    file_put_contents($filename, $imageData);

    $imageInfo = getimagesize($filename);
    if($imageInfo['mime'] != 'image/png') {
        echo 'Only PNG images are supported<br>';//frontend will always send png images
        echo 'Deleting image...<br>';
        file_put_contents($filename, "");
        if(unlink($filename))
            echo 'Image deleted successfully<br>';
        else
            echo 'Image deletion failed<br>';
    }
    else{
        echo 'Image is PNG<br>';
        echo 'Checking image ratio...<br>';
        $width = $imageInfo[0];
        $height = $imageInfo[1];
        $ratio = $width/$height;
        echo 'Image ratio is '.$ratio.'<br>';
        if($ratio == 1){//frontend will always send square images
            echo 'Image is square :)<br>';
        }
        else{
            echo 'Image is not square, deleting image...<br>';
            if(unlink($filename))
                echo 'Image deleted successfully<br>';
            else
                echo 'Image deletion failed<br>';
        }
    }
