console.clear();


// crop the source image at various aspect ratios

document.getElementById("file").addEventListener("change", (event)=> {
	console.log(event.target.files[0]);
	let image = event.target.files[0];
	cropImage(image).then((url)=>{
		fetch("crop.php",{
			method: 'POST',
			body: url
		}).then((response)=>{
			return response.text();
		}).then((text)=>{
			console.log(text);
		})
	});
	//.then((url)=>{
	//console.log(url);
	//	document.getElementById("img").src=url;
	//<});
	
});

function cropImage(image){
	imageObjUrl = window.URL.createObjectURL(image);
	console.log(imageObjUrl);
	return crop(imageObjUrl, 1/1).then(canvas => {
		imageObjUrl = window.URL.revokeObjectURL(imageObjUrl);//libero la memoria che pesa un casino un'immagine
		let url = canvas.toDataURL("image/png");
		console.log(url);
		return url;
	});
}
/**
 * @url - Source of the image to use
 * @aspectRatio - The aspect ratio to apply
 */
function crop(url, aspectRatio) {
	
	return new Promise(resolve => {

		// this image will hold our source image data
		const inputImage = new Image();

		// we want to wait for our image to load
		inputImage.onload = () => {

			// let's store the width and height of our image
			const inputWidth = inputImage.naturalWidth;
			const inputHeight = inputImage.naturalHeight;

			// get the aspect ratio of the input image
			const inputImageAspectRatio = inputWidth / inputHeight;

			// if it's bigger than our target aspect ratio
			let outputWidth = inputWidth;
			let outputHeight = inputHeight;
			if (inputImageAspectRatio > aspectRatio) {//devo aumentare la larghezza->spazio ai lati orizzontali
				outputHeight = (1/aspectRatio)*inputWidth;
			} else if (inputImageAspectRatio < aspectRatio) {//devo aumentare l'altezza->spazio ai lati verticali
				outputWidth = aspectRatio*inputHeight;
			}

			// calculate the position to draw the image at
			const outputX = (1*outputWidth - 1*inputWidth) * .5;
			const outputY = (1*outputHeight - 1*inputHeight) * .5;

			// create a canvas that will present the output image
			const outputImage = document.createElement('canvas');
			outputImage.id="mioCanvas";
			// set it to the same size as the image
			outputImage.width = outputWidth;
			outputImage.height = outputHeight;

			// draw our image at position 0, 0 on the canvas
			const ctx = outputImage.getContext('2d');
			ctx.drawImage(inputImage, outputX, outputY);
			resolve(outputImage);
		};

		// start loading our image
		inputImage.src = url;
		
	});
	
};